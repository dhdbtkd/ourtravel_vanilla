const Utils = {
    /**
     * 
     * @param {integer} length 생성할 문자열 길이 
     * @returns 
     */
    generateRandomString: (length = 12) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
        
}

export default Utils;