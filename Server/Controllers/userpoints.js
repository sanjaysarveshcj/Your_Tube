import User from '../Models/Auth.js';

export const getUserPoints = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ points: user.points })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}