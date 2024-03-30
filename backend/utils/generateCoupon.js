const generateCoupon = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let CouponCode = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        CouponCode += characters.charAt(randomIndex);
    }
    console.log("CouponCode", CouponCode)
    return CouponCode;
}

module.exports = generateCoupon