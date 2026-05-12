const express = require('express');
const { getStatesOfCountry, getCitiesOfState } = require('@countrystatecity/countries');

const router = express.Router();

const TTL_MS = 24 * 60 * 60 * 1000;

let cache = {
  data: null,
  expiresAt: 0,
};

/**
 * GET /india-cities — flattened City + State list for India (ODbL data via @countrystatecity/countries).
 */
router.get('/india-cities', async (req, res) => {
  try {
    if (cache.data && Date.now() < cache.expiresAt) {
      return res.json({ success: true, cities: cache.data });
    }

    const states = await getStatesOfCountry('IN');
    const list = [];

    for (const state of states) {
      const stateCode = state.iso2;
      const cities = await getCitiesOfState('IN', stateCode);
      for (const city of cities) {
        list.push({
          name: city.name,
          stateCode,
          stateName: state.name,
          label: `${city.name}, ${state.name}`,
        });
      }
    }

    list.sort((a, b) => a.label.localeCompare(b.label));

    cache = {
      data: list,
      expiresAt: Date.now() + TTL_MS,
    };

    return res.json({ success: true, cities: list });
  } catch (err) {
    console.error('geo/india-cities error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to load cities',
    });
  }
});

module.exports = router;
