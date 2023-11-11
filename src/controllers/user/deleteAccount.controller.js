import models from '../../database/models/index.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';

const { internalError, userNotFound } = responseTemplate

const deleteAccountController = async (req, res) => {
  try {
    const id_usuario = req.id_user;
    const { confirm } = req.body;

    if (confirm == false) {
      return res.sendStatus(204);
    } else {
      // cambiar el estado de la cuenta a desactivado
      const disabledUser = await models.userModels.updateSettingsUserById(
        id_usuario,
        { state_account: false }
      );
      if (!disabledUser) {
        return res.status(404).json(userNotFound());
      }

      res.status(200).json({ message: "Your account has been deactivated" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(internalError());
  }
};

export default deleteAccountController;
