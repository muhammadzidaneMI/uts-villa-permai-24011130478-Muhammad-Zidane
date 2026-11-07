const dataVila = [
    {
        id: 1,
        nama: "Vila Mawar",
        tipe: "2 Kamar",
        lokasi: "Puncak Pass, Bogor",
        harga: 750000,
        fasilitas: "WiFi, Dapur, TV, Parkir",
        status: "Tersedia"
    },
    {
        id: 2,
        nama: "Vila Melati",
        tipe: "3 Kamar",
        lokasi: "Cisarua, Bogor",
        harga: 1000000,
        fasilitas: "Kolam Renang, WiFi, Dapur",
        status: "Tersedia"
    },
    {
        id: 3,
        nama: "Vila Anggrek",
        tipe: "4 Kamar",
        lokasi: "Megamendung, Bogor",
        harga: 1250000,
        fasilitas: "Kolam Renang, Karaoke, Dapur",
        status: "Terbatas"
    }
];


const villaList = document.getElementById("villaList");
const villaSelect = document.getElementById("villaSelect");
const bookingForm = document.getElementById("bookingForm");
const resultBox = document.getElementById("resultBox");
const searchVilla = document.getElementById("searchVilla");
const checkButton = document.getElementById("checkButton");


function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
}


function renderVila(data) {

    villaList.innerHTML = "";

    if (data.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = "Vila yang Anda cari tidak ditemukan.";
        villaList.appendChild(pesan);
        return;
    }

    data.forEach(function(vila) {

        const card = document.createElement("article");
        card.className = "villa-card";

        const nama = document.createElement("h3");
        nama.textContent = vila.nama;

        const tipe = document.createElement("p");
        tipe.textContent = "Tipe: " + vila.tipe;

        const lokasi = document.createElement("p");
        lokasi.textContent = "Lokasi: " + vila.lokasi;

        const harga = document.createElement("p");
        harga.className = "villa-card__price";
        harga.textContent = formatRupiah(vila.harga) + " / malam";

        const fasilitas = document.createElement("p");
        fasilitas.textContent = "Fasilitas: " + vila.fasilitas;

        const status = document.createElement("span");
        status.className = "villa-card__status";
        status.textContent = "Status: " + vila.status;

        card.appendChild(nama);
        card.appendChild(tipe);
        card.appendChild(lokasi);
        card.appendChild(harga);
        card.appendChild(fasilitas);
        card.appendChild(status);

        villaList.appendChild(card);

    });

}


function isiPilihanVila() {

    dataVila.forEach(function(vila) {

        const option = document.createElement("option");

        option.value = vila.id;
        option.textContent =
            vila.nama + " - " + formatRupiah(vila.harga) + "/malam";

        villaSelect.appendChild(option);

    });

}


function validasiForm() {

    const nama = document.getElementById("guestName").value.trim();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const jumlahTamu = Number(document.getElementById("guestCount").value);
    const vila = villaSelect.value;

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    if (nama === "") {
        return {
            valid: false,
            pesan: "Nama tamu wajib diisi."
        };
    }

    if (checkIn === "" || checkOut === "") {
        return {
            valid: false,
            pesan: "Tanggal check-in dan check-out wajib diisi."
        };
    }

    const tanggalCheckIn = new Date(checkIn);
    const tanggalCheckOut = new Date(checkOut);

    if (tanggalCheckIn < hariIni) {
        return {
            valid: false,
            pesan: "Tanggal check-in tidak boleh di masa lalu."
        };
    }

    if (tanggalCheckOut <= tanggalCheckIn) {
        return {
            valid: false,
            pesan: "Tanggal check-out harus setelah tanggal check-in."
        };
    }

    if (jumlahTamu < 1 || jumlahTamu > 10) {
        return {
            valid: false,
            pesan: "Jumlah tamu harus antara 1 sampai 10 orang."
        };
    }

    if (vila === "") {
        return {
            valid: false,
            pesan: "Silakan pilih unit vila terlebih dahulu."
        };
    }

    return {
        valid: true,
        pesan: ""
    };

}


function hitungTotalHarga() {

    const hasilValidasi = validasiForm();

    if (!hasilValidasi.valid) {
        resultBox.innerHTML =
            "<h3>Perhatian</h3><p>" +
            hasilValidasi.pesan +
            "</p>";

        return;
    }

    const checkIn = new Date(
        document.getElementById("checkIn").value
    );

    const checkOut = new Date(
        document.getElementById("checkOut").value
    );

    const jumlahTamu = Number(
        document.getElementById("guestCount").value
    );

    const idVila = Number(villaSelect.value);

    const vilaDipilih = dataVila.find(function(vila) {
        return vila.id === idVila;
    });

    const selisihWaktu = checkOut - checkIn;

    const jumlahMalam = Math.ceil(
        selisihWaktu / (1000 * 60 * 60 * 24)
    );

    /* 
       Logika biaya:
       Harga vila per malam x jumlah malam.
       Jumlah tamu ditampilkan sebagai informasi,
       tetapi tidak mengubah harga karena harga
       ditetapkan berdasarkan unit vila.
    */

    const totalHarga = vilaDipilih.harga * jumlahMalam;

    resultBox.innerHTML = `
        <h3>Ringkasan Biaya</h3>
        <p><strong>Vila:</strong> ${vilaDipilih.nama}</p>
        <p><strong>Jumlah Tamu:</strong> ${jumlahTamu} orang</p>
        <p><strong>Jumlah Malam:</strong> ${jumlahMalam} malam</p>
        <p><strong>Harga per Malam:</strong> ${formatRupiah(vilaDipilih.harga)}</p>
        <p><strong>Total Biaya:</strong> ${formatRupiah(totalHarga)}</p>
    `;

    return {
        vila: vilaDipilih,
        jumlahMalam: jumlahMalam,
        totalHarga: totalHarga
    };

}


searchVilla.addEventListener("input", function() {

    const kataKunci = searchVilla.value.toLowerCase();

    const hasilFilter = dataVila.filter(function(vila) {

        return (
            vila.nama.toLowerCase().includes(kataKunci) ||
            vila.lokasi.toLowerCase().includes(kataKunci)
        );

    });

    renderVila(hasilFilter);

});


checkButton.addEventListener("click", function() {
    hitungTotalHarga();
});


bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const dataPemesanan = hitungTotalHarga();

    if (!dataPemesanan) {
        return;
    }

    const namaTamu = document.getElementById("guestName").value.trim();

    try {

        localStorage.setItem("namaTamuTerakhir", namaTamu);

        resultBox.innerHTML += `
            <p><strong>Pesanan berhasil disimpan secara lokal.</strong></p>
            <p>Terima kasih, ${namaTamu}. Silakan hubungi pemilik vila untuk konfirmasi lebih lanjut.</p>
        `;

    } catch (error) {

        resultBox.innerHTML += `
            <p>Data pesanan tidak dapat disimpan di perangkat ini.</p>
        `;

        console.error("Terjadi kesalahan:", error);

    }

});


function muatNamaTamuTerakhir() {

    try {

        const namaTerakhir =
            localStorage.getItem("namaTamuTerakhir");

        if (namaTerakhir) {
            document.getElementById("guestName").value =
                namaTerakhir;
        }

    } catch (error) {

        console.error(
            "Nama tamu terakhir tidak dapat dimuat.",
            error
        );

    }

}


renderVila(dataVila);
isiPilihanVila();
muatNamaTamuTerakhir();

const inputOtomatis = [
    document.getElementById("checkIn"),
    document.getElementById("checkOut"),
    document.getElementById("guestCount"),
    document.getElementById("villaSelect")
];

inputOtomatis.forEach(function(input) {

    input.addEventListener("change", function() {

        const checkIn = document.getElementById("checkIn").value;
        const checkOut = document.getElementById("checkOut").value;
        const jumlahTamu = document.getElementById("guestCount").value;
        const vila = villaSelect.value;

        if (checkIn && checkOut && jumlahTamu && vila) {
            hitungTotalHarga();
        }

    });

});