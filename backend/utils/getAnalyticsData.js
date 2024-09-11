import createError from "./createError.js"
import User from "../models/User.model.js"
import Product from "../models/Product.model.js"
import Order from "../models/Order.model.js"



export const getAnalytics = async () => {

    try {
           
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()

        const salesData = await Order.aggregate([
            {
                $group : {
                    _id : null , // that means it group all orders doc togther
                    totalSales : {$sum : 1} , // this will be the summation of the total orders doc in the db (num of orders in the db)
                    totalRevenue : {$sum : "$totalAmount"} // this will be the summation of the total amount key of all orders doc in the db (profit)
                }
            }
        ])


        const {totalSales , totalRevenue} = salesData[0] || {totalSales : 0 , totalRevenue : 0} 
        
        return{
            users : totalUsers ,
            products : totalProducts ,
            totalSales ,
            totalRevenue
        }

    } catch (error) {
        console.log(error)
    }

}





export const getDailySalesData = async (startDate , endDate) => {

    try {
        
        const dailySalesData = await Order.aggregate([
            {
                $match : { // $match: Filters the orders based on the createdAt field within the given date range.
                    createdAt : {
                        $gte : startDate ,
                        $lte : endDate
                    }
                }
            },
            {
                $group : { // Groups the results by date ($dateToString formats the date as YYYY-MM-DD) and calculates the total ORDERS ($sum: 1) and total revenue ($sum: "$totalAmount").
                    _id : {$dateToString : {format : "%Y-%m-%d" , date : "$createdAt"}} ,
                    sales : {$sum : 1} ,
                    revenue : {$sum : "$totalAmount"} 
                }
            },
            { 
                $sort : {_id : 1} // $sort: Sorts the grouped data by date in ascending order. because the _id key from the previous stage will have the date value
            }
        ])

        const dateArray = getDatesInRange(startDate , endDate) // This utility function generates an array of dates (in YYYY-MM-DD format) between the startDate and endDate

        return dateArray.map(date => {

            const foundDate = dailySalesData.find(data => data._id === date)

            return{
                date ,
                sales : foundDate?.sales || 0 ,
                revenue : foundDate?.revenue || 0 ,
            }

        })

    } catch (error) {
        console.log(error)
    }

}



// sample of the data structure that we will have after the aggregate in the getDailySalesData function

// [
//     {
//         _id : "2024-08-18",
//         sales : "12",
//         revenue : "1450.65"
//     },
//     {
//         _id : "2024-08-20",
//         sales : "8",
//         revenue : "1150.625"
//     },
// ]





function getDatesInRange(startDate , endDate) {

    const dates = []

    let currentDate = new Date(startDate)

    while(currentDate <= endDate){
        dates.push(currentDate.toISOString().split("T")[0]) // Format date as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() - 1) // Move to the next day
    }

    return dates

}