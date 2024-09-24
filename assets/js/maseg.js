document.addEventListener('DOMContentLoaded', () => {
  const subjectInput = document.getElementById('subject');
  const addSubjectButton = document.getElementById('addSubject');
  const subjectList = document.getElementById('subjectList');
  const reminderTimeInput = document.getElementById('reminderTime');
  const setReminderButton = document.getElementById('setReminder');
  const reminderSound = document.getElementById('reminderSound'); // عنصر الصوت
  
  let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
  let reminderTime = localStorage.getItem('reminderTime') || null;
  let reminderInterval = null; // لتخزين معرف الفاصل الزمني (Interval)

  // Load saved subjects
  subjects.forEach(subject => {
    addSubjectToList(subject);
  });

  // Add subject
  addSubjectButton.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    if (subject) {
      subjects.push({ name: subject, completed: false });
      addSubjectToList({ name: subject, completed: false });
      localStorage.setItem('subjects', JSON.stringify(subjects));
      subjectInput.value = '';
    }
  });

  // Add subject to the UI
  function addSubjectToList(subject) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${subject.name}</span>
      <button class="boutto complete-btn">تم</button>
    `;
    
    // Mark as completed and remove subject
    li.querySelector('.complete-btn').addEventListener('click', () => {
      li.remove(); // حذف المادة من القائمة
      subjects = subjects.filter(sub => sub.name !== subject.name); // حذف المادة من المصفوفة
      localStorage.setItem('subjects', JSON.stringify(subjects)); // تحديث LocalStorage
      
      // تحقق مما إذا كانت جميع المواد قد اكتملت
      if (subjects.length === 0) {
        clearInterval(reminderInterval); // إلغاء التذكير إذا انتهت جميع المواد
        localStorage.removeItem('reminderTime'); // حذف وقت التذكير من LocalStorage
        alert('تم الانتهاء من جميع المواد. تم إيقاف التذكير.');
      }
    });
    
    subjectList.appendChild(li);
  }

  // Request notification permission
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }

  // Set reminder
  setReminderButton.addEventListener('click', () => {
    reminderTime = reminderTimeInput.value;
    if (reminderTime) {
      localStorage.setItem('reminderTime', reminderTime);
      const timeDifference = new Date(reminderTime).getTime() - new Date().getTime();
      
      // بدء التذكير عند الوقت المحدد
      setTimeout(() => {
        sendReminder(); // إرسال أول تذكير
        reminderInterval = setInterval(sendReminder, 60 * 60 * 1000); // إرسال التذكير كل ساعة
      }, timeDifference);
    }
  });

  // Send reminder with sound and desktop notification
  function sendReminder() {
    // إصدار صوت التذكير
    reminderSound.play();

    // إظهار إشعار سطح المكتب
    if (Notification.permission === "granted") {
      const notification = new Notification("اهلا احمد", {
        body: "حان وقت دراسة المواد الآن!",
        icon: "assets/images/im-1.jpeg" // يمكن استبداله بصورة مخصصة أو إزالته
      });

      // إشعار عند الضغط على الإشعار
      notification.onclick = () => {
        window.focus();
      };
    } else {
      alert('تذكير: يجب عليك دراسة المواد الآن!');
    }
  }

  // Clear completed subjects and reset reminder
  function clearCompleted() {
    subjects = subjects.filter(subject => !subject.completed);
    localStorage.setItem('subjects', JSON.stringify(subjects));
    subjectList.innerHTML = '';
    subjects.forEach(addSubjectToList);
    reminderTime = null;
    localStorage.removeItem('reminderTime');
  }
});
