import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import * as jwt from 'jsonwebtoken';
import { CompanyUser } from "../entity/CompanyUser";
import config from "../config/config";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const userRespository = AppDataSource.getRepository(CompanyUser);
        const { username, password} = req.body;
        let user: CompanyUser;
        if (!username || !password) {
            return res.status(400).json({ message: ' Username & Password are required!' });
        }

        try {
            user = await userRespository.findOneOrFail({where: {username}});
        } catch (error) {
            return res.status(404).json({message: 'Username or Password incorrect! Not user'})
        }

        if (password != user.password) {
            return res.status(404).json({message: 'Username or Password incorrect!'});
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'OK', token, userId: user.id, role: user.role, username: user.username });

    }

    static changePassword = (req: Request, res: Response) => {
        
    }

    static logout = (req: Request, res: Response) => {
        
    }
}

export default AuthController;