import { Request, Response } from 'express'
import { getRepository } from 'typeorm';
import orphanageView from '../views/orphanages_views';


import Orphanage from '../models/Orphanage'

export default {
  async index(request: Request, response: Response) {
    const orphanageRepository = getRepository(Orphanage);
    const orphanages = await orphanageRepository.find({
      relations: ['images']
    });

    return response.json(orphanageView.renderMany(orphanages))
  },

  async show(request: Request, response: Response) {
    const { id } = request.params

    const orphanageRepository = getRepository(Orphanage);
    const orphanage = await orphanageRepository.findOneOrFail(id, { relations: ['images'] });

    return response.json(orphanageView.render(orphanage))
  },

  async create(request: Request, response: Response) {

    const { name, latitude, longitude, about, instructions, opening_hours, open_weekends } = request.body;
    const orphanageRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename }
    })

    const orphanage = orphanageRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_weekends: open_weekends === 'true' ,
      images
    });

    await orphanageRepository.save(orphanage)

    return response.status(201).json(orphanage)

  }
}