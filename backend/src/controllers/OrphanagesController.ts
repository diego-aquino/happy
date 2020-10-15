import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanageView';

// index(), show(), create(), update(), delete()
const OrphanagesController = {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    return response.json(orphanageView.renderMany(orphanages));
  },

  async show(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
    const { id: orphanageId } = request.params;

    try {
      const orphanage = await orphanagesRepository.findOneOrFail(orphanageId, {
        relations: ['images']
      });

      return response.json(orphanageView.render(orphanage));
    } catch (error) {
      return response.status(404).json({});
    }
  },

  async create(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours
    } = request.body;

    const open_on_weekends = request.body.open_on_weekends == 'true';

    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename };
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        }
      ))
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const orphanage = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage);
  }
};

export default OrphanagesController;
