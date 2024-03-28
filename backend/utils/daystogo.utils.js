// function daystogo(dob) {
//     const birth_date = new Date(dob)
//     // console.log("birth_date", birth_date)

//     const today_date = new Date();
//     // console.log("today_date", today_date)
//     const current_bithdate = new Date(today_date.getFullYear(), birth_date.getMonth(), birth_date.getDate());
//     // console.log("current_birthdate", current_bithdate)

//     let difference = current_bithdate.getTime() - today_date.getTime();
//     // console.log("difference", difference);

//     if (difference < 0) {
//         current_bithdate.setFullYear(current_bithdate.getFullYear() + 1);
//         // console.log(current_bithdate)

//         difference = Math.abs(current_bithdate.getTime() - today_date.getTime());
//     }
//     // console.log("differencee", difference);

//     const daystogo = Math.ceil(difference / (1000 * 60 * 60 * 24));
//     // console.log("daystogo", daystogo)
//     return daystogo;

// }


function daystogo(dob) {
    const birth_date = new Date(dob)
    // console.log("birth_date", birth_date)

    const today_date = new Date();
    // console.log("today_date", today_date)
    const current_bithdate = new Date(today_date.getFullYear(), birth_date.getMonth(), birth_date.getDate());
    // console.log("current_birthdate", current_bithdate)

    let difference = current_bithdate.getTime() - today_date.getTime();
    // console.log("difference", difference);

    // if (difference < 0) {
    //     current_bithdate.setFullYear(current_bithdate.getFullYear() + 1);
    //     console.log(current_bithdate)

    //     difference = Math.abs(current_bithdate.getTime() - today_date.getTime());
    // }
    // console.log("differencee", difference);

    const daystogo = Math.ceil(difference / (1000 * 60 * 60 * 24));
    // console.log("daystogo", daystogo)
    // return daystogo;

    if (daystogo < 0) {
        current_bithdate.setFullYear(current_bithdate.getFullYear() + 1);
        // console.log(current_bithdate)
        difference = Math.abs(current_bithdate.getTime() - today_date.getTime());
        // console.log("differencee", difference);
        const daystogo = Math.ceil(difference / (1000 * 60 * 60 * 24));
        // console.log("daystogo", daystogo)
        return daystogo;

    } else {
        const result = Math.abs(daystogo);
        return result
    }


}




module.exports = daystogo;

