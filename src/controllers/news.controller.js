import fs from 'fs';
import path from 'path';
import slugify from 'slugify'
import News from '../models/news.model.js'

import { createNewsSchema, updateNewsSchema } from '../validators/news';


export const createNews = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Yangilik yaratishda xatolik yuz berdi' });
    }
}


export const updateNews = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Yangilik yangilashda xatolik yuz berdi' });
    }
}


export const deleteNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni o\'chirishda xatolik yuz berdi' });
    }
}


export const getAllNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangiliklarni olishda xatolik yuz berdi' });
    }
}

export const getNewsBySearch = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni olishda xatolik yuz berdi' });
    }
}

export const getMyNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yaratgan yangiliklaringizni olishda xatolik yuz berdi' });
    }
}

export const getNewsByslug = async (req, res) => {
    try {

    }catch (error) {
        res.status(500).json({ message: 'Yangilikni olishda xatolik yuz berdi' });
    }
}

