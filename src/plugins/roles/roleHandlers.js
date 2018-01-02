import { Role } from '../../models'
import { getError } from '../../utils/errorUtils'

export async function getRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .findById(id)
      .throwIfNotFound()
    reply({
      role,
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function getRolesHandler (req, reply) {
  try {
    const roles = await Role.query()
    reply({
      roles: roles,
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function createRoleHandler (req, reply) {
  try {
    const role = await Role.query()
      .insert(req.payload)
    reply({
      role,
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function patchRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .patchAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      role,
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function putRoleHandler (req, reply) {
  const {id} = req.params

  try {
    const role = await Role.query()
      .updateAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      role,
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function deleteRoleHandler (req, reply) {
  const {id} = req.params
  try {
    await Role.query()
      .deleteById(id)
      .throwIfNotFound()

    reply({
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}
