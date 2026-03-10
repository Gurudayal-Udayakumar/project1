const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export const verifyRecaptcha = async (req, res, next) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET;
    const token = req.body?.recaptchaToken;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "reCAPTCHA is not configured",
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification is required",
      });
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(403).json({
        success: false,
        message: "reCAPTCHA verification failed",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to verify reCAPTCHA",
    });
  }
};
