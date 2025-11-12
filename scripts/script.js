// Фильтрация проектов, модальные окна и переключатель тем
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initializeTheme();
    
    // Инициализация круговых прогресс-баров
    initializeSkillCircles();
    
    // Инициализация lazy loading
    initializeLazyLoading();
    
    // Фильтры на странице проектов
    initializeProjectFilters();
    
    // Модальные окна для проектов
    initializeProjectModals();
    
    // Обработка формы контактов (обновленная)
    initializeContactForm();
    
    // Добавление записи в дневник
    initializeDiaryEntry();
    
    // Инициализация доступности навигации
    initializeNavigationAccessibility();
});

// Функция для инициализации круговых прогресс-баров
function initializeSkillCircles() {
    const skillCircles = document.querySelectorAll('.skill-circle');
    
    skillCircles.forEach(circle => {
        const percent = circle.getAttribute('data-percent');
        circle.style.setProperty('--p', percent + '%');
    });
}

// Функция для lazy loading изображений
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Функция для инициализации фильтров проектов
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-full-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Обновляем активную кнопку
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Фильтруем проекты
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Функция для инициализации модальных окон проектов
function initializeProjectModals() {
    const projectCardsClickable = document.querySelectorAll('.project-full-card, .project-card');
    const modal = document.getElementById('projectModal');
    
    if (!modal) return;
    
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalBody = document.getElementById('modalProjectBody');
    const modalClose = document.querySelector('.modal-close');
    
    // Открытие модального окна
    projectCardsClickable.forEach(card => {
        card.addEventListener('click', function(e) {
            // Проверяем, не был ли клик на ссылке внутри карточки
            if (e.target.tagName === 'A') return;
            
            const title = this.querySelector('.project-full-title, .project-title')?.textContent || 'Проект';
            const tech = this.querySelector('.project-full-tech')?.textContent || '';
            const desc = this.querySelector('.project-full-desc')?.textContent || '';
            const features = this.querySelectorAll('.feature-tag');
            
            let featuresHTML = '';
            features.forEach(feature => {
                featuresHTML += `<span class="feature-tag">${feature.textContent}</span>`;
            });
            
            modalTitle.textContent = title;
            modalBody.innerHTML = `
                <div class="modal-development">
                    <div class="modal-development-icon" aria-hidden="true">🚧</div>
                    <h3>Страница в разработке</h3>
                    <p>Детальная информация о проекте скоро появится здесь!</p>
                    <div style="margin-top: 20px; padding: 15px; background: var(--bg-light); border-radius: 8px;">
                        <h4>Планируемое содержимое:</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Полное описание проекта</li>
                            <li>Скриншоты и демонстрации</li>
                            <li>Ссылки на живую версию</li>
                            <li>Исходный код на GitHub</li>
                            <li>Используемые технологии</li>
                        </ul>
                    </div>
                    ${tech ? `<p><strong>Технологии:</strong> ${tech}</p>` : ''}
                    ${desc ? `<p><strong>Описание:</strong> ${desc}</p>` : ''}
                    ${featuresHTML ? `<div class="project-features" style="margin-top: 15px;">${featuresHTML}</div>` : ''}
                </div>
            `;
            
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            
            // Фокус на модальное окно
            modal.focus();
            
            // Захват фокуса внутри модалки
            trapFocus(modal);
        });
        
        // Добавляем обработчик для клавиатуры
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
        
        modalClose.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeModal();
            }
        });
    }
    
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        // Возвращаем фокус на элемент, который открыл модалку
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('project-full-card')) {
            activeElement.focus();
        }
    }
    
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Фокус на первый элемент
        if (firstElement) {
            firstElement.focus();
        }
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Функция для инициализации формы контактов (полностью переработанная)
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Добавляем ARIA-атрибуты к полям формы
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        
        if (nameField) {
            nameField.setAttribute('aria-describedby', 'name-required');
        }
        if (emailField) {
            emailField.setAttribute('aria-describedby', 'email-required email-hint');
        }
        if (messageField) {
            messageField.setAttribute('aria-describedby', 'message-required message-hint');
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сброс предыдущих ошибок
            resetErrors();
            
            // Валидация полей
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;
            
            // Валидация имени
            if (!name.value.trim()) {
                showError(name, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }
            
            // Валидация email
            if (!email.value.trim()) {
                showError(email, 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Пожалуйста, введите корректный email адрес');
                isValid = false;
            }
            
            // Валидация сообщения
            if (!message.value.trim()) {
                showError(message, 'Пожалуйста, введите сообщение');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            }
            
            if (isValid) {
                // В реальном приложении здесь был бы AJAX запрос
                showSuccess('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
                contactForm.reset();
                
                // Возвращаем фокус на первое поле после успешной отправки
                setTimeout(() => {
                    name.focus();
                }, 100);
            } else {
                // Фокус на первое поле с ошибкой
                const firstError = contactForm.querySelector('[aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
        
        // Валидация в реальном времени при потере фокуса
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Сброс ошибки при вводе
            input.addEventListener('input', function() {
                if (this.getAttribute('aria-invalid') === 'true') {
                    this.removeAttribute('aria-invalid');
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
            
            // Обработка клавиши Enter в полях формы
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    // Находим следующее поле
                    const formElements = Array.from(contactForm.elements);
                    const currentIndex = formElements.indexOf(e.target);
                    const nextElement = formElements[currentIndex + 1];
                    
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
            });
        });
    }
}

// Валидация отдельного поля
function validateField(field) {
    let isValid = true;
    let message = '';
    
    switch(field.type) {
        case 'email':
            if (field.value && !isValidEmail(field.value)) {
                isValid = false;
                message = 'Введите корректный email адрес';
            }
            break;
        case 'text':
            if (field.required && !field.value.trim()) {
                isValid = false;
                message = 'Это поле обязательно для заполнения';
            } else if (field.id === 'name' && field.value.trim().length < 2 && field.value.trim().length > 0) {
                isValid = false;
                message = 'Имя должно содержать минимум 2 символа';
            }
            break;
        case 'textarea':
            if (field.required && !field.value.trim()) {
                isValid = false;
                message = 'Это поле обязательно для заполнения';
            } else if (field.value.trim().length < 10 && field.value.trim().length > 0) {
                isValid = false;
                message = 'Сообщение должно содержать минимум 10 символов';
            }
            break;
    }
    
    if (!isValid) {
        showError(field, message);
    } else {
        field.removeAttribute('aria-invalid');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    return isValid;
}

// Показать ошибку поля
function showError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    
    // Удаляем старую ошибку если есть
    const existingError = document.getElementById(`${field.id}-error`);
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем элемент ошибки
    const errorElement = document.createElement('div');
    errorElement.id = `${field.id}-error`;
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    field.parentNode.appendChild(errorElement);
    
    // Обновляем aria-describedby
    const currentDescribedBy = field.getAttribute('aria-describedby') || '';
    const describedByIds = currentDescribedBy.split(' ').filter(id => id && !id.includes('-error'));
    describedByIds.push(`${field.id}-error`);
    field.setAttribute('aria-describedby', describedByIds.join(' '));
}

// Сброс всех ошибок
function resetErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    
    const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
    invalidFields.forEach(field => {
        field.removeAttribute('aria-invalid');
        const describedBy = field.getAttribute('aria-describedby');
        if (describedBy) {
            const describedByIds = describedBy.split(' ').filter(id => id && !id.includes('-error'));
            field.setAttribute('aria-describedby', describedByIds.join(' '));
        }
    });
}

// Показать сообщение об успехе
function showSuccess(message) {
    // Удаляем старое сообщение если есть
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Создаем элемент успеха
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.setAttribute('role', 'status');
    successElement.setAttribute('aria-live', 'polite');
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successElement, form);
    
    // Фокус на сообщение об успехе для скринридеров
    successElement.focus();
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
        }
    }, 5000);
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для добавления записи в дневник
function initializeDiaryEntry() {
    const addEntryBtn = document.getElementById('addEntryBtn');
    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', function() {
            const title = prompt('Введите заголовок записи:');
            if (title) {
                const description = prompt('Введите описание:');
                if (description) {
                    alert('Запись добавлена! В реальном приложении здесь была бы база данных.');
                }
            }
        });
        
        // Обработка клавиатуры для кнопки
        addEntryBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// Функция для инициализации и переключения темы
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Проверяем сохранённую тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Светлая';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Тёмная';
    }
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.textContent = '☀️';
                if (themeText) themeText.textContent = 'Светлая';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.textContent = '🌙';
                if (themeText) themeText.textContent = 'Тёмная';
            }
        });
        
        // Обработка клавиатуры для переключателя темы
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// Инициализация доступности навигации
function initializeNavigationAccessibility() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Обработка skip-link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => {
                        target.removeAttribute('tabindex');
                    }, 1000);
                }
            }
        });
    }
}

// Оптимизация для медленных соединений
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData) {
        // Отключаем некоторые тяжелые ресурсы при экономии трафика
        const heavyImages = document.querySelectorAll('img[data-heavy]');
        heavyImages.forEach(img => {
            img.src = img.getAttribute('data-light-src');
        });
    }
    
    if (connection.effectiveType.includes('2g')) {
        // Упрощаем анимации для медленных соединений
        document.documentElement.style.setProperty('--transition', 'none');
    }
}