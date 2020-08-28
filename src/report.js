const { getTrips } = require('api');
const { getAllDrivers, getAllVehicles, toDouble } = require('./utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 2
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  try {
    const trips = await getTrips();
    const drivers = await getAllDrivers(trips);
    const vehicles = await getAllVehicles(drivers);

    const reports = {};

    trips.map((trip) => {
      const amount = toDouble(trip.billedAmount);
      const driver = drivers.find((d) => d.id === trip.driverID);
      const driverVehicles = vehicles.find((v) => d.driverID === driver.id);
      const _trip = {
        user: trip.user.name,
        created: trip.created,
        pickup: trip.pickup,
        destination: trip.destination,
        billed: Number(amount.toFixed(2)),
        isCash: trip.isCash,
      };

      if (trip.driverID in reports) {
        reports[trip.driverID].trips.push(_trip);
        reports[trip.driverID].noOfTrips++;
        reports[trip.driverID].totalAmountEarned += Number(amount.toFixed(2));
        if (trip.isCash) {
          reports[trip.driverID].noOfCashTrips++;
          reports[trip.driverID].totalCashAmount += Number(amount.toFixed(2));
        } else {
          reports[trip.driverID].noOfNonCashTrips++;
          reports[trip.driverID].totalNonCashAmount += Number(
            amount.toFixed(2),
          );
        }
      } else {
        reports[trip.driverID] = {
          id: trip.driverID,
          vehicles: (driverVehicles || []).map((v) => ({
            plate: v.plate,
            manufacturer: v.manufacturer,
          })),
          noOfTrips: 1,
          noOfCashTrips: trip.isCash ? 1 : 0,
          noOfNonCashTrips: trip.isCash ? 0 : 1,
          trips: [_trip],
          totalAmountEarned: Number(amount.toFixed(2)),
          totalCashAmount: Number((trip.isCash ? amount : 0).toFixed(2)),
          totalNonCashAmount: Number((trip.isCash ? 0 : amount).toFixed(2)),
        };
        if (driver) {
          reports[trip.driverID] = {
            fullName: driver.name,
            phone: driver.phone,
            ...reports[trip.driverID],
          };
        }
      }

      reports[trip.driverID].totalAmountEarned = Number(
        reports[trip.driverID].totalAmountEarned.toFixed(2),
      );
      reports[trip.driverID].totalCashAmount = Number(
        reports[trip.driverID].totalCashAmount.toFixed(2),
      );
      reports[trip.driverID].totalNonCashAmount = Number(
        reports[trip.driverID].totalNonCashAmount.toFixed(2),
      );
    });

    return Object.values(reports);
  } catch (error) {
    console.log(error);
  }
}

module.exports = driverReport;
