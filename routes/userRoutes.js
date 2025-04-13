const express = require('express');
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.patch(
    '/users/:id',
    authMiddleware,
    async (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;
        const authenticatedUserId = req.userId;

        if (!authenticatedUserId) {
            console.error('Erro: req.userId não definido pelo authMiddleware.');
            return res.status(500).json({ error: 'Authentication error.' });
        }

        if (id !== authenticatedUserId.toString()) {
            return res.status(403).json({ error: 'Forbidden: You can only update your own profile.' });
        }

        try {
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            let updated = false;
            const updateData = {};

            if (name && name !== user.name) {
                updateData.name = name;
                updated = true;
            }

            if (email && email !== user.email) {
                const existingEmail = await User.findOne({ where: { email } });
                if (existingEmail && existingEmail.id.toString() !== id) {
                    return res.status(400).json({ error: 'Email already in use by another account.' });
                }
                updateData.email = email;
                updated = true;
            }

            if (updated) {
                await user.update(updateData);
            } else {
                return res.status(200).json({
                    message: 'No changes detected.',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });
            }

            res.status(200).json({
                message: 'Profile updated successfully.',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });

        } catch (error) {
            console.error('Update profile error:', error);
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
            }
            res.status(500).json({ error: 'Failed to update profile.' });
        }
    }
);

router.post(
    '/users/change-password',
    authMiddleware,
    async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!userId) {
            console.error('Erro: req.userId não definido pelo authMiddleware.');
            return res.status(500).json({ error: 'Authentication error.' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
        }

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect current password.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });

            res.status(200).json({ message: 'Password updated successfully.' });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Failed to change password.' });
        }
    }
);

module.exports = router;