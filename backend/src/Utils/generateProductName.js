export const generateProductName = () => {
    const name = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    let result = ''

    for( let i=0; i <= 15; i++){
        const randomindex = Math.floor(Math.random() * name.length);
        result += name.charAt(randomindex)
    }
    return result;
}
