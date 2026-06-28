CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(240) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_key VARCHAR(80) NOT NULL DEFAULT 'member',
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  actor_email VARCHAR(240) NOT NULL DEFAULT 'system',
  action VARCHAR(240) NOT NULL,
  scope VARCHAR(120) NOT NULL,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(160) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  role_key VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  permission_key VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_key VARCHAR(80) NOT NULL REFERENCES roles(role_key) ON DELETE CASCADE,
  permission_key VARCHAR(120) NOT NULL REFERENCES permissions(permission_key) ON DELETE CASCADE,
  PRIMARY KEY (role_key, permission_key)
);

INSERT INTO app_users (name, email, password_hash, role_key, status)
VALUES ('Admin User', 'admin@example.com', '{noop}password', 'owner', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO roles (role_key, name, description) VALUES
  ('owner', 'Owner', 'Full workspace, billing, and security access'),
  ('admin', 'Admin', 'Manage users, roles, content, and operations'),
  ('member', 'Member', 'Use product workflows and assigned tools')
ON CONFLICT (role_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO permissions (permission_key, name, description) VALUES
  ('dashboard:view', 'View dashboard', 'View workspace dashboard and metrics'),
  ('users:read', 'Read users', 'View users and profile metadata'),
  ('users:write', 'Write users', 'Create, update, and disable users'),
  ('roles:read', 'Read roles', 'View roles, permissions, and menus'),
  ('roles:write', 'Write roles', 'Create and update roles and permissions'),
  ('audit:read', 'Read audit logs', 'View audit trail entries'),
  ('ai:use', 'Use AI', 'Use AI chat and prompt tools'),
  ('files:read', 'Read files', 'List and download file assets'),
  ('files:write', 'Write files', 'Upload and manage file assets'),
  ('email:send', 'Send email', 'Preview and send email messages'),
  ('settings:write', 'Write settings', 'Manage workspace settings')
ON CONFLICT (permission_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO role_permissions (role_key, permission_key)
SELECT 'owner', permission_key FROM permissions
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_key, permission_key) VALUES
  ('admin', 'dashboard:view'),
  ('admin', 'users:read'),
  ('admin', 'users:write'),
  ('admin', 'roles:read'),
  ('admin', 'audit:read'),
  ('admin', 'ai:use'),
  ('admin', 'files:read'),
  ('admin', 'files:write'),
  ('admin', 'email:send'),
  ('member', 'dashboard:view'),
  ('member', 'ai:use'),
  ('member', 'files:read')
ON CONFLICT DO NOTHING;
