import { Check, X } from "lucide-react";
import '../components/PasswordStrengthMeter.css';

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className='password-criteria'>
      {criteria.map((item) => (
        <div key={item.label} className='criterion-item'>
          {item.met ? (
            <Check className='criterion-icon met' />
          ) : (
            <X className='criterion-icon unmet' />
          )}
          <span className={item.met ? "criterion-label met" : "criterion-label unmet"}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "strength-0";
    if (strength === 1) return "strength-1";
    if (strength === 2) return "strength-2";
    if (strength === 3) return "strength-3";
    return "strength-4";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className='password-strength-meter'>
      <div className='strength-header'>
        <span className='strength-label'>Password strength</span>
        <span className='strength-value'>{getStrengthText(strength)}</span>
      </div>

      <div className='strength-bars'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`strength-bar ${index < strength ? getColor(strength) : "strength-bar-empty"}`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;