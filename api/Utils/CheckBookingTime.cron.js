import cron from "node-cron";
import Booking from "../Modal/Hotels/BookingSchema.js";
// import User from "../Modal/User/UserSchema.js";
// import nodemailer from 'nodemailer';

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your-email@gmail.com",
//     pass: "your-email-password",
//   },
// });

// Function to send email
// const sendEmail = async (userEmail, bookingId) => {
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: userEmail,
//     subject: 'Unpaid Booking Reminder',
//     text: `Your booking with ID ${bookingId} is still unpaid. Please complete the payment.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// Scheduled task to check for unpaid bookings

// cron.schedule("*/30 * * * *", async () => {
//     const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
//     console.log({ thirtyMinutesAgo: thirtyMinutesAgo });

//     const unpaidBookings = await Booking.find({
//       paymentStatus: "pending",
//       createdAt: { $lte: thirtyMinutesAgo },
//     }).populate("user");

//     //   let updatedBooking;
//     await Promise.all([
//       unpaidBookings.forEach(async (booking) => {
//         User.findByIdAndUpdate(booking._id, {
//           $set: {
//             isCancelled: true,
//             cancellationReason: "unpaid",
//             deletedBy: booking.user._id,
//             cancellationDate: Date.now(),
//           },
//         });
//         // if (user) {
//         //   await sendEmail(user.email, booking._id);
//         // }
//       }),
//     ]);
// })

export const checkBookingTime = () => {
  return cron.schedule("*/30 * * * *", async () => {
    console.log("Cron job started");
    const thirtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    // console.log({ thirtyMinutesAgo: thirtyMinutesAgo });

    const unpaidBookings = await Booking.find({
      paymentStatus: "pending",
      createdAt: { $lte: thirtyMinutesAgo },
      isCancelled: false,
    }).populate("user");

    //   let updatedBooking;
    let updatedBooking = undefined;
    await Promise.all([
      unpaidBookings?.forEach(async (booking) => {
        // console.log({ booking: booking });
        updatedBooking = await Booking.findByIdAndUpdate(
          { _id: booking._id },
          {
            $set: {
              isCancelled: true,
              cancellationReason: "unpaid",
              deletedBy: booking.user._id,
              cancellationDate: Date.now(),
            },
          },
          { new: true }
        );
        // if (user) {
        //   await sendEmail(user.email, booking._id);
        // }
      }),
      // console.log({ updatedBooking: updatedBooking }),
    ]);
  });
  //   console.log("Cron job started");
};

// export default { checkBookingTime };
