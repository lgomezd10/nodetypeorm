import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

export class UserController {

    static getAll = async (req: Request, res: Response) => { 
        const userRepository = getRepository(User);
        let users;

        try {
            users = await userRepository.find();
            res.send(users);
        } catch (error) {
            res.status(404).json({message: 'Something goes wrong to find Users'});
        }
    }

    static getById = async (req: Request, res: Response) => { 
        const userRepository = getRepository(User);
        const { id } = req.params;
        let user;

        try {
            user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch (error) {
            res.status(404).json({message: 'User not found'});
        }
    }

    static new = async (req: Request, res: Response) => { 
        const userRepository = getRepository(User);
        let user = new User();
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({message: 'Needed username and password'});
        }
        user.username = username;
        user.password = password;
        user.role = role ? role: "user";

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).json({ message: 'Username already exist' });
        }

        res.json('User created')
         
    }

    static edit = async (req: Request, res: Response) => { 
        const userRepository = getRepository(User);
        const { id } = req.params;
        const { username, role } = req.body;
        let user

        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username? username: user.username;
            user.role = role ? role: user.role;
          } catch (e) {
            return res.status(404).json({ message: 'User not found' });
          }
          const validationOpt = { validationError: { target: false, value: false } };
          const errors = await validate(user, validationOpt);
      
          if (errors.length > 0) {
            return res.status(400).json(errors);
          }
      
          // Try to save user
          try {
            await userRepository.save(user);
          } catch (e) {
            return res.status(409).json({ message: 'Username already in use' });
          }
      
          res.status(201).json({ message: 'User update' });
    }

    static delete = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const userRepository = getRepository(User);
        let user: User;

        try {
        user = await userRepository.findOneOrFail(id);
        } catch (e) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Remove user
        userRepository.delete(id);
        res.status(201).json({ message: ' User deleted' });        
    }

}