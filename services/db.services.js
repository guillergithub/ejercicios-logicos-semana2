import fs from "fs/promises";
import path from "path";
import faker from "faker";
import { json } from "express";

class AcademloDb {

    static dbPath = path.resolve("db", "db.json");

    static findAll = async() => {
        try{
            let data = await fs.readFile(this.dbPath, "utf8");
            return JSON.parse(data);
        }catch(error){
            throw new Error("Hubo un error al tratar de obtener todos los registros de la DB");
        }
    }

    static findById =  async id => {
        const users = await this.findAll();
        return users.find(user => user.id === id);         
    }

    static create = async (obj, id) => {
        try {
            let users = await this.findAll();
            let newUser = {...obj};
            users.push(newUser);
            await fs.writeFile(this.dbPath, JSON.stringify(users));
            console.log('nuevo usuario: ', newUser)
            return newUser;
        } catch (error) {
            throw new Error("Hubo un error al tratar de escribir los registros de la DB");
        }
    }

    static update = async (obj, id) => {
        try {
            let users = await this.findAll();
            let userIndex = users.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                users[userIndex] = obj;            
                await fs.writeFile(this.dbPath, JSON.stringify(users));                   
                return obj;
            } else {
                throw new Error("Error al editar un usuario que no existe en los registros de la DB");
            }
        } catch (error) {
            throw new Error("Hubo un error al tratar de editar los registros de la DB");
        }
    }

    static delete = async id => {
        try {
            let users = await this.findAll();
            console.log(users.some(user => user.id === id))
            if (users.some(user => user.id === id)) {
                let newUsers = users.filter(user => user.id !== id);
                await fs.writeFile(this.dbPath, JSON.stringify(newUsers));
                return true;
            } else {
                return false;
            }
        
        } catch (error) {
            throw new Error("Hubo un error al tratar de eliminar un registro de la DB");
        }

    }

    static clear = async() => {
        try{
            await fs.writeFile(this.dbPath, JSON.stringify([]));
        }catch(error){
            throw new Error("Hubo un error al tratar de vaciar la DB");
        }
    }

    static populateDB = async(size) => {
        let userArr = [];
        for(let i = 0; i<size; i++){
            let userObj = {
                id: i + 1,
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                email: faker.internet.email().toLowerCase()
            };

            userArr.push(userObj);
        }

        try{
            await fs.writeFile(this.dbPath, JSON.stringify(userArr));
            return userArr;
        }catch(error){
            throw new Error("Hubo un error al insertar en la base de datos");
        }
    }

}

export default AcademloDb;