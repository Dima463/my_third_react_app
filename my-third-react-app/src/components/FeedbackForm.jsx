import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // --- Состояния полей ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false);

  // --- Ошибки ---
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // --- Процесс отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Тронутые поля ---
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // --- Успешная отправка ---
  const [submitted, setSubmitted] = useState(false);

  // --- Функции валидации ---
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-Я\s-]+$/.test(value.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  // Зависимая валидация email (Задание 3)
  const validateEmail = (value) => {
    if (!wantReply && !value.trim()) return null;
    if (wantReply && !value.trim()) return "Email обязателен для заполнения";
    if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Некорректный формат email";
    return null;
  };

  // Валидация телефона (Задание 2)
  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) return "Введите номер полностью";
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value))
      return "Формат: +7 (XXX) XXX-XX-XX";
    return null;
  };

  // Валидация сообщения с лимитом 500 (Задание 1)
  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > 500) return "Максимум 500 символов";
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
  };

  // --- Маска телефона (Задание 2) ---
  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }
    if (digits && !digits.startsWith("7")) {
      digits = "7" + digits;
    }
    digits = digits.slice(0, 11);

    let result = "";
    if (digits.length > 0) result = "+" + digits[0];
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 5) result += ") " + digits.slice(4, 7);
    if (digits.length >= 8) result += "-" + digits.slice(7, 9);
    if (digits.length >= 10) result += "-" + digits.slice(9, 11);

    return result;
  };

  // --- Обработчик изменения поля ---
  const handleChange = (field, value) => {
    let newValue = value;
    if (field === "phone") {
      newValue = formatPhone(value);
    }

    switch (field) {
      case "name":
        setName(newValue);
        break;
      case "email":
        setEmail(newValue);
        break;
      case "phone":
        setPhone(newValue);
        break;
      case "message":
        setMessage(newValue);
        break;
      default:
        break;
    }

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](newValue),
      }));
    }
  };

  // --- Обработчик потери фокуса ---
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const currentValue =
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "phone"
        ? phone
        : message;

    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  // --- Обработчик чекбокса (Задание 3) ---
  const handleWantReplyChange = (checked) => {
    setWantReply(checked);

    // Пересчитываем ошибку email с учётом нового значения чекбокса
    setErrors((prev) => ({
      ...prev,
      email: checked
        ? !email.trim()
          ? "Email обязателен для заполнения"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
          ? "Некорректный формат email"
          : null
        : null,
    }));
  };

  // --- Отправка формы ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // --- Динамические классы ---
  const getInputClass = (field) => {
    const classes = ["field__input"];

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      // Для message показываем "успех" только если что-то введено
      if (field === "message" && message.length === 0) {
        // не добавляем valid для пустого message
      } else {
        classes.push("field__input--valid");
      }
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  // --- Экран успеха ---
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setWantReply(false);
            setErrors({
              name: null,
              email: null,
              phone: null,
              message: null,
            });
            setTouched({
              name: false,
              email: false,
              phone: false,
              message: false,
            });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  // --- Основная форма ---
  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Чекбокс «Хочу получить ответ» (Задание 3) */}
      <div className="field field--checkbox">
        <label className="field__checkbox-label">
          <input
            type="checkbox"
            checked={wantReply}
            onChange={(e) => handleWantReplyChange(e.target.checked)}
          />
          <span>Хочу получить ответ</span>
        </label>
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email {wantReply && <span className="field__required">*</span>}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder={wantReply ? "Обязательное поле" : "Необязательно"}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* Поле «Телефон» (Задание 2) */}
      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (___) ___-__-__"
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* Поле «Сообщение» со счётчиком (Задание 1) */}
      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500}
        />
        <span className="field__counter">{message.length} / 500</span>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;