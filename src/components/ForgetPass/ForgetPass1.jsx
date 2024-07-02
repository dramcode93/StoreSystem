import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ErrorAlert } from '../../form/Alert';
import Aos from 'aos';
import 'aos/dist/aos.css';
import forget from './forget.module.css';
import { useI18nContext } from '../context/i18n-context';

const ForgetPassword = () => {
  const { language, t } = useI18nContext();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const resetToken = Cookies.get('resetToken');

  useEffect(() => {
    Aos.init();
  }, []);

  const handleForgetPasswordStep1 = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://store-system-api.gleeze.com/api/auth/forgetPassword', {
        email: email,
      });
      const resetToken = response.data.resetToken;
      const tokenTime = 1;
      Cookies.set('resetToken', resetToken, { expires: tokenTime, secure: true, sameSite: 'strict' });
      setStep(2);
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      ErrorAlert({ text: "An error occurred while sending the reset password request" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPasswordStep2 = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://store-system-api.gleeze.com/api/auth/verifyResetPasswordCode', {
        resetCode: verificationCode,
      }, { headers: { Authorization: `Bearer ${resetToken}` } });
      setStep(3);
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      ErrorAlert({ text: "Wrong verification code" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPasswordStep3 = async () => {
    try {
      setLoading(true);
      await axios.put('https://store-system-api.gleeze.com/api/auth/resetPassword', {
        newPassword,
        confirmNewPassword,
      }, { headers: { Authorization: `Bearer ${resetToken}` } });
      Cookies.remove('resetToken');
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      ErrorAlert({ text: "An error occurred while resetting password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      {step === 1 && (
        <div className={forget.forgetPasswordContainer}>
          <label>{t("Home.Email")}:</label>
          <input className={` border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className='secondaryBtn' onClick={handleForgetPasswordStep1} disabled={loading}>
            {loading ? `${t("Home.Sending")}` : `${t("Home.SendResetCode")}`}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={forget.forgetPasswordContainer} data-aos="fade-left" data-aos-delay="300">
          <h4>{t("Home.Step2")}</h4>
          <p>{t("Home.Wesentverification")}</p>
          <input
            className={`border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
            type="text"
            placeholder={t("Home.Enterverificationcode")}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button className='secondaryBtn' onClick={handleForgetPasswordStep2} disabled={loading}>
            {loading ? `${t("Home.Loading")}` : `${t("Home.ResetPassword")}`}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={forget.forgetPasswordContainer3} data-aos="fade-left" data-aos-delay="300">
          <h4>{t("Home.Step3")}</h4>
          <p>{t("Home.Choosenewpassword")}:</p>
          <input className={`${forget.firstInput}  border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
            type="password"
            placeholder={t("Home.Enternewpassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p>{t("Home.Confirmpassword")}</p>
          <input className={`${forget.firstInput} border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
            type="password"
            placeholder={t("Home.Confirmnewpassword")}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button className='secondaryBtn' onClick={handleForgetPasswordStep3} disabled={loading}>
            {loading ? `${t("Home.Loading")}` : `${t("Home.ResetPassword")}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
