const getMainUrl = (req) => {
    return req.protocol + "://" + req.get('host');
}

const slugify = (str) => {
    return str.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

module.exports = {
    getMainUrl,
    slugify
}