



export const getStats = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Dashboard statistikasini olishda xatolik yuz berdi' });
    }
}

export const getNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangiliklarni olishda xatolik yuz berdi' });
    }
}

export const aprroveNewsbyId = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni tasdiqlashda xatolik yuz berdi' });
    }
}

export const rejectNewsbyId = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni rad etishda xatolik yuz berdi' });
    }
}


export const getUsers = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik yuz berdi' });
    }
}


export const getNewsByUserId = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchining yangiliklarini olishda xatolik yuz berdi' });
    }   
}

export const blockUserById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini bloklashda xatolik yuz berdi' });
    }   
}

export const unblockUserById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini blokdan chiqarishda xatolik yuz berdi' });
    }
}



export const createCategory = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yaratishda xatolik yuz berdi' });
    }   
}


export const updateCategoryById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yangilashda xatolik yuz berdi' });
    }   
}


export const deleteCategoryById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya o\'chirishda xatolik yuz berdi' });
    }
}



export const createTags = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg yaratishda xatolik yuz berdi' });
    }   
}


export const updateTagsById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg yangilashda xatolik yuz berdi' });
    }   
}


export const deleteTagsById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg o\'chirishda xatolik yuz berdi' });
    }
}

