package com.classhub.notification.service.impl;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.classhub.notification.service.client.AuthClient;
import com.classhub.notification.service.client.WorkspaceClient;
import com.classhub.notification.dto.internal.AssignmentNotificationRequest;
import com.classhub.notification.dto.internal.InternalUserResponse;
import com.classhub.notification.dto.internal.InternalWorkspaceMemberResponse;
import com.classhub.notification.dto.internal.ResourceNotificationRequest;
import com.classhub.notification.dto.internal.SubmissionNotificationRequest;
import com.classhub.notification.service.EmailService;
import com.classhub.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final WorkspaceClient workspaceClient;
    private final AuthClient authClient;
    private final EmailService emailService;

    @Override
    public void notifyAssignmentCreated(
            AssignmentNotificationRequest request) {

        List<InternalWorkspaceMemberResponse> members =
                workspaceClient.getWorkspaceMembers(
                        request.getWorkspaceId());

        if (members == null || members.isEmpty()) {
            log.info(
                    "No students found in workspace {}. No assignment emails sent.",
                    request.getWorkspaceId());

            return;
        }

        InternalUserResponse teacher =
                authClient.getUser(request.getTeacherId());

        String teacherName = buildFullName(teacher);

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "dd MMM yyyy hh:mm a");

        for (InternalWorkspaceMemberResponse member : members) {

            try {
                InternalUserResponse student =
                        authClient.getUser(
                                member.getStudentId());

                if (!student.isEnabled()) {
                    log.warn(
                            "Skipping disabled student account: {}",
                            student.getId());

                    continue;
                }

                String studentName =
                        buildFullName(student);

                String subject =
                        "New Assignment Posted - ClassHub";

                String body = String.format("""
                        Hello %s,

                        A new assignment has been posted in your ClassHub workspace.

                        Assignment: %s
                        Teacher: %s
                        Due Date: %s

                        Please log in to ClassHub and submit the assignment before the deadline.

                        Regards,
                        ClassHub Team
                        """,
                        studentName,
                        request.getAssignmentTitle(),
                        teacherName,
                        request.getDueDate().format(formatter));

                emailService.sendEmail(
                        student.getEmail(),
                        subject,
                        body);

                log.info(
                        "Assignment notification sent to student {}",
                        student.getId());

            } catch (Exception exception) {

                /*
                 * Failure for one student must not stop notifications
                 * from being sent to the remaining students.
                 */
                log.error(
                        "Could not send assignment notification to student {}",
                        member.getStudentId(),
                        exception);
            }
        }
    }
    
    @Override
    public void notifyResourceUploaded(
            ResourceNotificationRequest request) {

        List<InternalWorkspaceMemberResponse> members =
                workspaceClient.getWorkspaceMembers(
                        request.getWorkspaceId());

        if (members == null || members.isEmpty()) {

            log.info(
                    "No students found in workspace {}. No resource emails sent.",
                    request.getWorkspaceId());

            return;
        }

        InternalUserResponse teacher =
                authClient.getUser(
                        request.getUploadedBy());

        String teacherName =
                buildFullName(teacher);

        for (InternalWorkspaceMemberResponse member : members) {

            try {

                InternalUserResponse student =
                        authClient.getUser(
                                member.getStudentId());

                if (!student.isEnabled()) {

                    log.warn(
                            "Skipping disabled student account: {}",
                            student.getId());

                    continue;
                }

                String studentName =
                        buildFullName(student);

                String subject =
                        "New Resource Uploaded - ClassHub";

                String fileName =
                        request.getOriginalFileName() == null
                                || request.getOriginalFileName().isBlank()
                                ? "Not available"
                                : request.getOriginalFileName();

                String body = String.format("""
                        Hello %s,

                        A new learning resource has been uploaded to your ClassHub workspace.

                        Resource Title: %s
                        Resource Type: %s
                        File Name: %s
                        Uploaded By: %s

                        Please log in to ClassHub to view or download the resource.

                        Regards,
                        ClassHub Team
                        """,
                        studentName,
                        request.getResourceTitle(),
                        request.getResourceType(),
                        fileName,
                        teacherName);

                emailService.sendEmail(
                        student.getEmail(),
                        subject,
                        body);

                log.info(
                        "Resource notification sent to student {}",
                        student.getId());

            } catch (Exception exception) {

                log.error(
                        "Could not send resource notification to student {}",
                        member.getStudentId(),
                        exception);
            }
        }
    }
    
    @Override
    public void notifyAssignmentSubmitted(
            SubmissionNotificationRequest request) {

        InternalUserResponse teacher =
                authClient.getUser(request.getTeacherId());

        InternalUserResponse student =
                authClient.getUser(request.getStudentId());

        if (!teacher.isEnabled()) {

            log.warn(
                    "Teacher account is disabled. Notification not sent: {}",
                    teacher.getId());

            return;
        }

        String teacherName = buildFullName(teacher);
        String studentName = buildFullName(student);

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "dd MMM yyyy hh:mm a");

        String subject =
                "Assignment Submitted - ClassHub";

        String body = String.format("""
                Hello %s,

                A student has submitted an assignment in ClassHub.

                Student: %s
                Assignment: %s
                Submitted At: %s
                Submission ID: %s

                Please log in to ClassHub to review the submission.

                Regards,
                ClassHub Team
                """,
                teacherName,
                studentName,
                request.getAssignmentTitle(),
                request.getSubmittedAt().format(formatter),
                request.getSubmissionId());

        emailService.sendEmail(
                teacher.getEmail(),
                subject,
                body);

        log.info(
                "Assignment submission notification sent to teacher {} for submission {}",
                teacher.getId(),
                request.getSubmissionId());
    }

    private String buildFullName(
            InternalUserResponse user) {

        String firstName =
                user.getFirstName() == null
                        ? ""
                        : user.getFirstName().trim();

        String lastName =
                user.getLastName() == null
                        ? ""
                        : user.getLastName().trim();

        String fullName =
                (firstName + " " + lastName).trim();

        return fullName.isBlank()
                ? user.getEmail()
                : fullName;
    }
}