//Gerekli Elementleri seçmek
const formlar = document.querySelector("#todoAddForm"); // Form elemanı
const giris = document.querySelector("#todoName"); // Görev giriş alanı
const todo_listesi = document.querySelector(".list-group"); // Görevlerin listelendiği alan
const ilk_card = document.querySelectorAll(".card-body")[0]; // İlk kartın içeriği
const iki_card = document.querySelectorAll(".card-body")[1]; // İkinci kartın içeriği
const temizlik_butonu = document.querySelector("#clearButton"); // Tüm görevleri temizleme butonu
const filtre = document.querySelector("#todoSearch"); // Görev filtreleme alanı

let todolar = []; // Todo listesini tutacak dizi

// Etkinlikleri başlatan fonksiyonu çağır
run_events();

//İhtiyaç duyulacak metotlar
function run_events() {
    // Form gönderildiğinde görev ekleme fonksiyonunu çağır
    formlar.addEventListener("submit", gorev_ekle);
    // Sayfa yüklendiğinde görevleri kontrol et
    document.addEventListener("DOMContentLoaded", sayfa_yuklendi);
    // Görev silme işlemi için dinleyici
    iki_card.addEventListener("click", todo_sil_arayuz);
    // Tüm görevleri silme butonuna dinleyici
    temizlik_butonu.addEventListener("click", tum_todolar_sil);
    // Filtreleme işlemi için dinleyici
    filtre.addEventListener("keyup", filtrele);
}

// Sayfa yüklendiğinde mevcut görevleri yükler
function sayfa_yuklendi() {
    storagedan_todolar_kontrol();
    todolar.forEach(function (todo) {
        gorev_ekle_arayuz(todo);
    });
}

// Kullanıcının girdiği değere göre görevleri filtreler
function filtrele(e) {
    const filtre_deger = e.target.value.toLowerCase().trim(); // Kullanıcıdan alınan filtre değeri
    const todolar_listesi = document.querySelectorAll(".list-group-item"); // Listede bulunan tüm görevler

    if (todolar_listesi.length > 0) {
        // Eğer listede görev varsa
        todolar_listesi.forEach(function (todo) {
            // Her bir görev için
            if (todo.textContent.toLowerCase().trim().includes(filtre_deger)) {
                // Filtre değeri ile görevi karşılaştır
                todo.setAttribute("style", "display : block"); // Eşleşen görevleri göster
            } else {
                todo.setAttribute("style", "display : none !important"); // Eşleşmeyenleri gizle
            }
        });
    } else {
        uyari_goster("warning", "Filtreleme yapmak için gerekli sayıda eleman bulunamadı.");
    }
}

// Tüm görevleri listeden ve storage'dan siler
function tum_todolar_sil() {
    const todolar_listesi = document.querySelectorAll(".list-group-item"); // Listede bulunan tüm görevler
    if (todolar_listesi.length > 0) {
        //Ekrandan silme
        todolar_listesi.forEach(function (todo) {
            todo.remove();
        });
        //Storage'dan silme
        todolar = []; // Dizi sıfırlanır
        localStorage.setItem("todolar", JSON.stringify(todolar)); // LocalStorage'ı güncelle
        uyari_goster("info", "Görev listesi temizlendi");
    } else {
        uyari_goster("warning", "Görev listesi boş");
    }
}

// Arayüzden silme işlemi için görev silme fonksiyonu
function todo_sil_arayuz(e) {
    if (e.target.className === "fa fa-remove") {
        // Eğer silme simgesine tıklanmışsa
        //Ekrandan silme
        const todo = e.target.parentElement.parentElement; // Silinecek görev
        todo.remove();

        //Storage'dan Silme
        storagedan_todo_sil(todo.textContent); // Görevi Storage'dan sil
        uyari_goster("info", "Görev başarıyla silindi.");
    }
}

// Storage'dan bir görevi silen fonksiyon
function storagedan_todo_sil(todo_sil) {
    storagedan_todolar_kontrol();
    todolar.forEach(function (todo, index) {
        if (todo_sil === todo) {
            todolar.splice(index, 1); // Görevi diziden çıkar
        }
    });
    localStorage.setItem("todolar", JSON.stringify(todolar)); // LocalStorage'ı güncelle
}

// Yeni bir görevi formdan alarak ekleyen fonksiyon
function gorev_ekle(e) {
    const giris_metni = giris.value.trim(); // Giriş alanındaki metin
    if (giris_metni == null || giris_metni == "") {
        //"warning" yazıyı sarı arkaplanda gösterir
        uyari_goster("warning", "Lütfen bir değer giriniz!");
    } else {
        gorev_ekle_arayuz(giris_metni); // Yeni görevi arayüze ekle
        gorev_ekle_storage(giris_metni); // Yeni görevi storage'a ekle
        //"success" yazıyı yeşil arkaplanda gösterir
        uyari_goster("success", "Görev Eklendi");
    }
    e.preventDefault(); // Formun varsayılan gönderim davranışını engelle
}

// Yeni bir görevi arayüze ekleyen fonksiyon
function gorev_ekle_arayuz(yeni_todo) {
    //Arayüz için element oluşturma
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = yeni_todo; // Yeni görev metni

    //Bağlantılar
    const a = document.createElement("a");
    a.href = "#";
    a.className = "delete-item";

    const i = document.createElement("i");
    i.className = "fa fa-remove";

    //Bağlantıları ekleme
    a.appendChild(i);
    li.appendChild(a);
    todo_listesi.appendChild(li);

    giris.value = ""; // Giriş alanını temizle
}

// Yeni bir görevi storage'a ekleyen fonksiyon
function gorev_ekle_storage(yeni_todo) {
    storagedan_todolar_kontrol(); // LocalStorage'dan mevcut todoları kontrol et
    todolar.push(yeni_todo); // Yeni görevi diziye ekle
    localStorage.setItem("todolar", JSON.stringify(todolar)); // Todoları LocalStorage'a kaydet
}

// LocalStorage'dan mevcut görevleri kontrol eden fonksiyon
function storagedan_todolar_kontrol() {
    if (localStorage.getItem("todolar") == null) {
        todolar = []; // Eğer yoksa boş bir dizi oluştur
    } else {
        todolar = JSON.parse(localStorage.getItem("todolar")); // Varsa todoları diziye yükle
    }
}

// Kullanıcıya uyarı mesajı gösteren fonksiyon
function uyari_goster(type, message) {
    // Yeni bir div elementi oluştur
    const div = document.createElement("div");
    // Sınıf adı, 'alert' ve parametre olarak alınan 'type' ile dinamik olarak oluşturuluyor
    div.className = `alert alert-${type}`; //Literal Template

    /*
JavaScript'te literal template, dinamik stringler oluşturmak için kullanılan, ${} notasyonu ile
değişkenleri ve ifadeleri yerleştiren ` (backtick) karakterleriyle tanımlanan bir sözdizimidir.
    */

    // Div'in içeriğine, fonksiyona parametre olarak verilen 'message' metnini ata.
    div.textContent = message;

    // Bu, uyarının görünmesini sağlar.
    ilk_card.appendChild(div);

    // Bu, uyarının otomatik olarak kaybolmasını sağlar.
    setTimeout(function () {
        div.remove();
    }, 2500) // 2.5 saniye sonra uyarıyı kaldır
}
