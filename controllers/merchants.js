// @desc    Get all merchants
// @route   GET /api/v1/merchants
// @access  Public
exports.getMerchants = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Show all merchants`});
} 

// @desc    Get a single Merchant
// @route   GET /api/v1/merchants/:id
// @access  Public
exports.getMerchant = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Show merchants`});
} 

// @desc    Create new Merchant
// @route   POST /api/v1/merchants
// @access  Private
exports.createMerchant = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Create new Merchant`});  
} 

// @desc    Update a Merchant
// @route   PUT /api/v1/merchants/:id
// @access  Private
exports.updateMerchant = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Update Merchant ${req.params.id}`}); 
} 

// @desc    Delete a Merchant
// @route   GET /api/v1/merchants/:id
// @access  private
exports.deleteMerchant = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Delete Merchant ${req.params.id}`});
} 
