CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  created_by INT NULL,                           -- << agora permite NULL
  services_json JSON NULL,
  plan_type VARCHAR(60) NULL,
  value DECIMAL(10,2) NULL,
  due_date DATE NULL,
  consent_json JSON NULL,
  file_path VARCHAR(320) NULL,
  uploaded_signed_path VARCHAR(320) NULL,
  signature_sha256 CHAR(64) NULL,
  status ENUM('pendente','aprovada','reprovada') DEFAULT 'pendente',
  approved_by INT NULL,
  approved_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prop_company FOREIGN KEY (company_id)
    REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_prop_user FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL
);
