const AppleLogin = () => {
    const loginWithApple = async (e) => {
      e.preventDefault();
  
      console.log('sign in with apple');
  
      window.AppleID.auth.init({
        clientId: '[CLIENT_ID]',
        scope: '[SCOPES]',
        redirectURI: '[REDIRECT_URI]',
        state: '[STATE]',
        nonce: '[NONCE]',
        usePopup: true | false,
      });
  
      try {
        const res = await window.AppleID.auth.signIn();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
    
        <button onClick={loginWithApple}>Apple 로그인</button>
    );
  };
  
  export default AppleLogin;