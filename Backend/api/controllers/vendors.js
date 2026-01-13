const {   deleteVendor, putVerification, deleteMarketspaceApplication, downloadStatistic, getVerification, getStatistic, getMarketspaceApplication, getVendorsByCategoryId, getVendorProfileById, getVendors, getVendorById, postVendor, putVendor, deleteVendorById, putVendorById, putVendorImageById, putVendorProfileById } = require('../services/vendors')

const DeleteVendor = async (req, res) => {
    try {
        const { id: vendor_id } = req.params;
        const vendor = await deleteVendor(vendor_id);
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutVerification = async (req, res) => {
    try {
        const { id: vendor_id } = req.params;
        const { verified } = req.query;
        const verification = await putVerification(vendor_id, verified);
        res.status(200).json(verification);
    } catch (error) {
        res.status(500).send(error);
    }
}

const DeleteMarketspaceApplication = async (req, res) => {
    try {
        const { id: application_id } = req.query;
        const application = await deleteMarketspaceApplication(application_id);
        res.status(200).json(application);
    } catch (error) {
        res.status(500).send(error);
    }
}

const DownloadStatistic = async (req, res) => {

  try {
    const { id: vendor_id} = req.params;
    // Generate PDF buffer from service
    const pdfBuffer = await downloadStatistic(vendor_id);

    // Set headers for download
    const filename = `vendor-statistic.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[DownloadMarketStatistic]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

const GetVerification = async (req, res) => {
    try {
        const { id: vendor_id } = req.params;
        const verification = await getVerification(vendor_id);
        res.status(200).json(verification);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetStatistic = async (req, res) => {
    try {
        const { id: vendor_id } = req.params;
        const statistic = await getStatistic(vendor_id);
        res.status(200).json(statistic);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketspaceApplication = async (req, res) => {
    try {
        const { id: vendor_id } = req.params;
        const applications = await getMarketspaceApplication(vendor_id);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetVendors = async (req, res) => {
    try {
        const vendors = await getVendors();
        res.status(200).json(vendors);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const GetVendorById = async (req, res) => {
    try {
        const id = req.params.id;
        const Vendor = await getVendorById(id);
        res.status(200).json(Vendor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const PutVendorImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const { image } = req.body;
        const vendor = await putVendorImageById(id, image);
        res.status(200).send(vendor);
    } catch (err) {
        res.status(500).send(err);
    }
}

const GetVendorProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const vendor = await getVendorProfileById(id);
        res.status(200).json(vendor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const PutVendorProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
        const vendor = await putVendorProfileById(id, update);
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).send(err);
    }
}

const PostVendor = async (req, res) => {
    try {
        const data = req.body;
        const vendor = await postVendor(data);
        res.status(200).json(vendor);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const PutVendorById = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const Vendor = await putVendorById(id, updates);
        res.status(200).json(Vendor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const DeleteVendorById = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteVendorById(id);
        res.status(200).send("Successfully deleted")
    }
    catch (err) {
        res.status(500).send(err)
    }
}


module.exports = {
    DeleteVendor,
    PutVerification,
    DeleteMarketspaceApplication,
    DownloadStatistic,
    GetVerification,
    GetStatistic,
    GetMarketspaceApplication,
    PutVendorProfileById,
    PutVendorImageById,
    GetVendorProfileById,
    GetVendors,
    PostVendor,
    GetVendorById,
    PutVendorById,
    DeleteVendorById
}