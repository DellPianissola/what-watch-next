import { useState, useEffect } from 'react'
import { getProfiles, createProfile, updateProfile } from '../services/api.js'
import './Profiles.css'

const Profiles = ({ onProfileChange }) => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ name: '', avatar: '' })

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    setLoading(true)
    try {
      const response = await getProfiles()
      setProfiles(response.data.profiles)
      if (onProfileChange) onProfileChange(response.data.profiles)
    } catch (error) {
      console.error('Erro ao carregar perfis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editing) {
        await updateProfile(editing.id, formData)
      } else {
        await createProfile(formData)
      }
      setShowForm(false)
      setEditing(null)
      setFormData({ name: '', avatar: '' })
      loadProfiles()
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert(error.response?.data?.error || 'Erro ao salvar perfil')
    }
  }

  const handleEdit = (profile) => {
    setEditing(profile)
    setFormData({ name: profile.name, avatar: profile.avatar || '' })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', avatar: '' })
  }

  return (
    <div className="profiles-page">
      <div className="profiles-container">
        <div className="profiles-header">
          <h2>Perfis</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-create"
          >
            ➕ Novo Perfil
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="profile-form">
            <h3>{editing ? 'Editar Perfil' : 'Novo Perfil'}</h3>
            <input
              type="text"
              placeholder="Nome do perfil"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="url"
              placeholder="URL do avatar (opcional)"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="form-input"
            />
            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editing ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum perfil criado ainda</p>
            <p className="empty-hint">Crie um perfil para começar a adicionar filmes!</p>
          </div>
        ) : (
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <div className="profile-avatar">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3>{profile.name}</h3>
                <p className="profile-stats">
                  {profile._count?.movies || 0} filme{profile._count?.movies !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => handleEdit(profile)}
                  className="btn-edit"
                >
                  ✏️ Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profiles

