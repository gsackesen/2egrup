const Kategori = require('../models/category');

class KategoriRepository {
  async findAll() {
    return await Kategori.findAll();
  }

  async findByLang(dil) {
    
    return await Kategori.findAll({ where: { dil:dil } });
  }

  async findById(id) {
    return await Kategori.findByPk(id);
  }

  async create(data) {
    return await Kategori.create(data);
  }

  async update(id, data) { 
        
     
    return await Kategori.update(data,{where: { id: id }});

  }

  async delete(id) {
    return await Kategori.destroy({ where: { id } });
  }
  
  async findByName(kategori) {
    return await Kategori.findOne({ where: { kategori } });
  }
}

module.exports = new KategoriRepository();
