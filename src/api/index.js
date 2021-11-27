import request from '../utils/request';

export const api = {
    login: data => {
        return request({
            url: '/api/admin-login/',
            method: 'post',
            data:data
        });
    },

     // Category Related

    getCategories: query => {
        return request({
            url: '/api/category',
            method: 'get',
            params: query
        });
    },

    getAllCategories: query => {
        return request({
            url: '/api/all-category',
            method: 'get',
            params: query
        });
    },

    addCategory: data => {
        return request({
            url: '/api/add-category',
            method: 'post',
            data:data
        });
    },

    updateCategory: data => {
        return request({
            url: '/api/update-category',
            method: 'post',
            data:data
        });
    },

    deleteCategory: data => {
        return request({
            url: 'api/delete-category',
            method: 'post',
            data:data
        });
    },

 // Product Related
    
    getProducts: query => {
        return request({
            url: '/api/products',
            method: 'get',
            params: query
        });
    },
    getProductById: query => {
        return request({
            url: '/api/product',
            method: 'get',
            params: query
        });
    },
    
    addProduct: data => {
        return request({
            url: '/api/add-product',
            method: 'post',
            data:data
        });
    },
    updateProduct: data => {
        return request({
            url: '/api/update-product',
            method: 'post',
            data:data
        });
    },
    deleteProduct: query => {
        return request({
            url: '/api/delete-product',
            method: 'get',
            params: query
        });
    },
}

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
