const kategoriRepository = require('../repositories/kategoriRepository');

class categoryService {
  async getAllCategories() {
    return await kategoriRepository.findAll();
  }
  async getCategoriesByLang(lang) {
    
    return await kategoriRepository.findByLang(lang);
  }

  async createCategory(data) {
    return await kategoriRepository.create(data);
  }

  async updateCategory(id, data) {
    const kategori = await kategoriRepository.findById(id);
    if (!kategori) return null;    
    return await kategoriRepository.update(id, data);
  }

  async deleteCategory(id) {
    return await kategoriRepository.delete(id);
  }

  async getCategoryById(id) {
    return await kategoriRepository.findById(id);
  }

  async getByName(category){
    return await kategoriRepository.findByName(category);  
  }  

}

module.exports = new categoryService();
