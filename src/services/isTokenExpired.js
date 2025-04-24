import jwtDecode from 'jwt-decode';

export default function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; 
    console.log("exp:", exp);
    console.log("Date.now():", Date.now());
    return Date.now() > exp;
  } catch (error) {
    console.warn("Eroare la decodarea JWT:", error);
    return true; 
  }
}
