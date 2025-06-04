import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from '../middlewares/deviceIdParam.middleware';
import DataService from '../modules/services/data.service';
import Joi from 'joi';
import { IData } from 'modules/models/data.model';
import { read } from 'fs';




let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

   private initializeRoutes() {
   this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
   this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
   this.router.get(`${this.path}/:id`, checkIdParam, this.getDataById);
   this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getLatestById);
   this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getDataRange);
   this.router.delete(`${this.path}/all`, this.deleteAllData);
   this.router.delete(`${this.path}/:id`, checkIdParam, this.deleteById);
}


   private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr);
    };

private getDataById = async (request: Request, response: Response, next: NextFunction) => {
   const { id } = request.params;
   const allData = await this.dataService.query(id);
   response.status(200).json(allData);
};

private addData = async (request: Request, response: Response, next: NextFunction) => {
   const { air } = request.body;
   const { id } = request.params;

   const schema = Joi.object({
    air: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        value: Joi.number().positive().required()
      })
    )
    .unique((a, b) => a.id === b.id),
    deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
  });
  try {
    const validatedData = await schema.validateAsync({ air, deviceId: parseInt(id, 10) });
    const readingData:IData = {
       temperature: validatedData.air[0].value,
       pressure: validatedData.air[1].value,
       humidity: validatedData.air[2].value,
       deviceId: validatedData.deviceId
      };
      await this.dataService.createData(readingData);
      response.status(200).json(readingData);
    } catch (error) {
      console.error(`Validation Error: ${error.message}`);
      response.status(400).json({ error: 'Invalid input data.' });
    }
  };
  
  public getLatestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: 'Invalid device ID' });
      }

      const latestData = await this.dataService.get(deviceId);

      if (!latestData) {
        return res.status(404).json({ message: 'No data found for device' });
      }

      res.status(200).json(latestData);
    } catch (error) {
      next(error);
    }
  };
 private getDataRange = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, num } = req.params;
            const start = parseInt(id);
            const count = parseInt(num);

            if (isNaN(start) || isNaN(count) || start < 0 || count < 1) {
                return res.status(400).json({ message: 'Nieprawidłowe parametry' });
            }

            const result = testArr.slice(start, start + count);
            res.status(200).json({ values: result });
        } catch (error) {
            next(error);
        }
    };
 private deleteAllData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            testArr = [];
            res.status(200).json({ message: 'Wszystkie dane zostały usunięte' });
        } catch (error) {
            next(error);
        }
    };
     public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: 'Invalid device ID' });
      }

      await this.dataService.deleteData(deviceId);
      res.status(200).json({ message: `Data for device ${deviceId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  };


}

export default DataController;
