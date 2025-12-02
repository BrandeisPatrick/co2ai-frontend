import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2, Leaf } from 'lucide-react'

export default function SetupOrganization() {
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { createOrganization, organization, signOut } = useAuth()
  const navigate = useNavigate()

  // If already has organization, redirect to dashboard
  if (organization) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (orgName.trim().length < 2) {
      setError('Organization name must be at least 2 characters')
      setIsLoading(false)
      return
    }

    try {
      await createOrganization(orgName.trim())
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof Error && err.message.includes('duplicate')) {
        setError('An organization with this name already exists. Try a different name.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create organization')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Set up your lab</h2>
          <p className="mt-2 text-gray-600">
            Create an organization to start tracking emissions with your team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="e.g., Smith Lab, Biotech Research Inc."
            />
            <p className="mt-2 text-sm text-gray-500">
              This is your lab or company name. You can invite team members later.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Creating...'
            ) : (
              <>
                <Leaf className="w-5 h-5" />
                Create Organization
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-600 text-sm">
            Wrong account?{' '}
            <button
              onClick={handleSignOut}
              className="text-emerald-600 hover:underline font-medium"
            >
              Sign out
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
