import { getDataByUnique, updateDataByAny } from "@/services/serviceOperations";
import PasswordGenerator from "@/functions/other/PasswordGenerator";
import EncryptPassword from "@/functions/other/cryptology/encryptPassword";
import sendPasswordEmail from "../mail/sendMail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  try {
    // Kullanıcıyı e-posta adresine göre bul
    const user = await getDataByUnique("CARKART", {
      CARUNVAN3: email,
      CAROZKOD1: "A",
      CAROZKOD3: "B2",
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // Yeni şifre oluştur
    const newPassword = await PasswordGenerator(email);

    // Yeni şifreyi şifrele
    const encryptedPassword = await EncryptPassword(newPassword);

    if (!encryptedPassword) {
      return res
        .status(500)
        .json({ error: "Şifre oluşturulurken bir hata oluştu." });
    }

    // Veritabanında şifreyi güncelle
    const updatePassword = await updateDataByAny(
      "CARKART",
      { CARKOD: user.CARKOD },
      { CAROZKOD5: encryptedPassword }
    );

    if (!updatePassword) {
      return res
        .status(500)
        .json({ error: "Şifre güncellenirken bir hata oluştu." });
    }

    // Yeni şifreyi e-posta ile gönder
    const emailSent = await sendPasswordEmail(email, newPassword);

    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Yeni şifre e-posta ile gönderilemedi." });
    }

    return res.status(200).json({
      success: true,
      message: "Yeni şifreniz e-posta adresinize gönderildi.",
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return res
      .status(500)
      .json({ error: "Şifre sıfırlama işlemi sırasında bir hata oluştu." });
  }
}
