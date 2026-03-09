import { WriteBufferStream } from "./BufferStream";
import { ValueRepresentation } from "./ValueRepresentation";
import { TagHex } from "./constants/dicom";
import { defaultDICOMEncoding } from "./constants/encodings";

const EXPLICIT_LITTLE_ENDIAN = "1.2.840.10008.1.2.1";

let DicomMessage;

class DicomDict {
    constructor(meta) {
        this.meta = meta;
        this.dict = {};
    }

    upsertTag(tag, vr, values) {
        if (this.dict[tag]) {
            // Should already have tag accessors.
            this.dict[tag].Value = values;
        } else {
            this.dict[tag] = ValueRepresentation.addTagAccessors({ vr: vr });
            this.dict[tag].Value = values;
        }
    }

    write(
        writeOptions = {
            allowInvalidVRLength: false,
            encoding: defaultDICOMEncoding,
            littleEndian: true
        }
    ) {
        const metaSyntax = EXPLICIT_LITTLE_ENDIAN;
        const fileStream = new WriteBufferStream(
            4096,
            writeOptions.littleEndian,
            writeOptions.encoding
        );

        fileStream.writeUint8Repeat(0, 128);
        fileStream.writeAsciiString("DICM");

        const metaStream = new WriteBufferStream(
            1024,
            writeOptions.littleEndian,
            writeOptions.encoding
        );
        if (!this.meta[TagHex.TransferSyntaxUID]) {
            this.meta[TagHex.TransferSyntaxUID] = {
                vr: "UI",
                Value: [EXPLICIT_LITTLE_ENDIAN]
            };
        }
        DicomMessage.write(this.meta, metaStream, metaSyntax, writeOptions);
        DicomMessage.writeTagObject(
            fileStream,
            TagHex.FileMetaInformationGroupLength,
            "UL",
            metaStream.size,
            metaSyntax,
            writeOptions
        );
        fileStream.concat(metaStream);

        const useSyntax = this.meta[TagHex.TransferSyntaxUID].Value[0];
        DicomMessage.write(this.dict, fileStream, useSyntax, writeOptions);
        return fileStream.getBuffer();
    }

    /** Helper method to avoid circular dependencies */
    static setDicomMessageClass(dicomMessageClass) {
        DicomMessage = dicomMessageClass;
    }
}

export { DicomDict };
