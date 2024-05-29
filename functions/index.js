const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("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");

admin.initializeApp();
const db = admin.firestore();

// Function to transfer credits between users
exports.transferCredits = functions.https.onCall(async (data, context) => {
  const { fromUserId, toUserId, amount } = data;

  const fromUserRef = db.collection('users').doc(fromUserId);
  const toUserRef = db.collection('users').doc(toUserId);

  await db.runTransaction(async (transaction) => {
    const fromUserDoc = await transaction.get(fromUserRef);
    const toUserDoc = await transaction.get(toUserRef);

    if (!fromUserDoc.exists || !toUserDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const fromUserCredits = fromUserDoc.data().credits;
    const toUserCredits = toUserDoc.data().credits;

    if (fromUserCredits < amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Insufficient credits');
    }

    transaction.update(fromUserRef, { credits: fromUserCredits - amount });
    transaction.update(toUserRef, { credits: toUserCredits + amount });
  });

  return { success: true };
});

// Function to create Stripe payment intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { amount } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
});
