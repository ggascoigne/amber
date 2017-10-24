import { Profile } from '../../models'
import { getErrorCode } from '../../utils/testUtils'

export async function getProfileHandler (req, reply) {
  const {id} = req.params

  try {
    const profile = await new Profile({id}).fetch({require: true})
    reply({
      profile: profile,
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

export async function getProfilesHandler (req, reply) {
  try {
    const profiles = await Profile.collection().fetch()
    reply({
      profiles: profiles,
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

export async function createProfileHandler (req, reply) {
  try {
    const profile = await Profile.forge(req.payload).save()

    reply({
      success: true,
      profile,
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

export async function patchProfileHandler (req, reply) {
  const {id} = req.params

  try {
    const profile = await new Profile()
      .where({id})
      .fetch({require: true})
    const updatedProfile = await profile.save(req.payload, {patch: true})

    reply({
      success: true,
      profile: updatedProfile,
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

export async function putProfileHandler (req, reply) {
  const {id} = req.params

  try {
    const profile = await new Profile()
      .where({id})
      .fetch({require: true})
    const updatedProfile = await profile.save(req.payload)

    reply({
      success: true,
      profile: updatedProfile,
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

export async function deleteProfileHandler (req, reply) {
  const {id} = req.params

  try {
    const profile = await new Profile()
      .where({id})
      .fetch({require: true})
    await profile.destroy()

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
