

export const setCookies = (res , accessToken , refreshToken) => {

    res.cookie("accessToken" , accessToken , {
        httpOnly : true , // to prevent xss (cross site scripting) attacks
        secure : process.env.NODE_ENV === "production" , // if it was true we cant access the cookies until its https connection
        sameSite : "strict" , // to prevent CSRF (cross site request forgery) attacks
        maxAge : 15 * 60 * 1000 // the time for the refresh token cookie will be 15 min
    })

    res.cookie("refreshToken" , refreshToken , {
        httpOnly : true , // to prevent xss (cross site scripting) attacks
        secure : process.env.NODE_ENV === "production" , // if it was true we cant access the cookies until its https connection
        sameSite : "strict" , // to prevent CSRF (cross site request forgery) attacks
        maxAge : 7 * 24 * 60 * 60 * 1000 // the time for the refresh token cookie will be 15 min
    })

}