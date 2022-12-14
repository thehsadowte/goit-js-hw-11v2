// const axios = require('axios').default;
import axios from 'axios';

export class PixApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '31532418-13e40827eb9e43f177cec6109';

  constructor() {
    this.query = null;
    this.page = null;
    this.per_page = 40;
  }
  async fetchImage() {
    const searchParams = {
      params: {
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        key: this.#KEY,
        per_page: this.per_page,
      },
    };

    return await axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
