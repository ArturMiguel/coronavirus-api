function normalizeString(str: string | null) {
    return str
        ? str.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ł/g, 'l')
        : '';
}

export default normalizeString;