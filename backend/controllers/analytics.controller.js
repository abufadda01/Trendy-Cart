import { getAnalytics, getDailySalesData } from "../utils/getAnalyticsData.js"



const getAnalyticsData = async (req , res , next) => {

    try {
       
        const analyticsData  = await getAnalytics()

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // to get 7 days back before the current date (end date)

        const dailySalesData = getDailySalesData(startDate , endDate)

        res.status(200).json({analyticsData , dailySalesData})

    } catch (error) {   
        next(error)
    }
}



// output sample data

// "analyticsData": {
//     "users": 500,
//     "products": 200,
//     "totalSales": 100,
//     "totalRevenue": 20000
// },
// "dailySalesData": [
//     { "date": "2024-08-10", "sales": 10, "revenue": 1000 },
//     { "date": "2024-08-11", "sales": 12, "revenue": 1200 },
//     { "date": "2024-08-12", "sales": 5, "revenue": 500 },
//     { "date": "2024-08-13", "sales": 8, "revenue": 800 },
//     { "date": "2024-08-14", "sales": 20, "revenue": 2000 },
//     { "date": "2024-08-15", "sales": 7, "revenue": 700 },
//     { "date": "2024-08-16", "sales": 15, "revenue": 1500 }
// ]
// }




export {getAnalyticsData}