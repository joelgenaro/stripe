const axios = require("axios");
const paypalBaseUrl = "https://api.sandbox.paypal.com";
let token = "";
const authenticate = async () => {
    let { data } = await axios.post(`${paypalBaseUrl}/v1/oauth2/token`, {
        grant_type: 'client_credentials'
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Langugage': 'en_US'
        },
        auth: {
            username: global.env.PAYPAL_CLIENT_ID,
            password: global.env.PAYPAL_CLIENT_SECRET
        }
    });
    token = data.access_token;
    return data.access_token;
}

const createProduct = async (product) => {
    if (!token) token = await authenticate();
    let { data } = await axios.post(`${paypalBaseUrl}/v1/catalogs/products`,
        product, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
    return data;
}

const createBillingPlan = async (plan) => {
    if (!token) token = await authenticate();
    let { data } = await axios.post(`${paypalBaseUrl}/v1/billing/plans`,
        plan, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
    return data;
}

const createSubscription = async (subscription) => {
    if (!token) token = await authenticate();
    let { data } = await axios.post(`${paypalBaseUrl}/v1/billing/subscriptions`,
        subscription, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
    return data;
}

const getSubscription = async (id) => {
    if (!token) token = await authenticate();
    let { data } = await axios.get(`${paypalBaseUrl}/v1/billing/subscriptions/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
}

const getTransactionsBySubscription = async (subscription) => {
    if (!token) token = await authenticate();
    let { data } = await axios.get(`${paypalBaseUrl}/v1/billing/subscriptions/${subscription.id}/transactions?start_time=${subscription.billing_info.last_payment.time}&end_time=${subscription.billing_info.next_billing_time}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
}

module.exports = {
    createProduct,
    createBillingPlan,
    createSubscription,
    getSubscription,
    getTransactionsBySubscription
}