import Orphanage from "../models/Orphanage";
import imageView from '../views/imageView';

const orphanageView = {
  render(orphanage: Orphanage) {
    const {
      id,
      name,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    } = orphanage;

    return {
      id,
      name,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends,
      images: imageView.renderMany(images)
    };
  },

  renderMany(orphanages: Orphanage[]) {
    return orphanages.map(orphanage => this.render(orphanage))
  }
};

export default orphanageView;
