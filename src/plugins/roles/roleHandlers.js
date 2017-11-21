import { Role } from '../../models'
import { getErrorCode } from '../../utils/testUtils'

export async function getRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .findById(id)
      .throwIfNotFound()
    reply({
      role,
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function getRolesHandler (req, reply) {
  try {
    const roles = await Role.query()
    reply({
      roles: roles,
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function createRoleHandler (req, reply) {
  try {
    const role = await Role.query()
      .insert(req.payload)
    reply({
      success: true,
      role,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function patchRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .patchAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      success: true,
      role,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function putRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .updateAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      success: true,
      role,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function deleteRoleHandler (req, reply) {
  const {id} = req.params
  try {
    await Role.query()
      .deleteById(id)
      .throwIfNotFound()

    reply({
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}
