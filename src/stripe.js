import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_live_51PJgfs042seB52fD1xg3gLcrlyDWodRxhOQd5jGyggQ72YKp3rkc3S54LrIy9skjURGVEk5Kp9jPs2xeLSyppMdj00LpgFehqp");

export { stripePromise };
